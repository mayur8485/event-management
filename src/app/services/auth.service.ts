import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "../environments/environment.prod";


export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string;
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new BehaviorSubject<any>(null);
    tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) { }

    signUp(creds: any) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseKey,
            {
                email: creds.email,
                password: creds.password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(
                respData => {
                    this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
                }
            ));
    }


    login(creds: any) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseKey,
            {
                email: creds.email,
                password: creds.password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(
                respData => {
                    this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
                }
            ));
    }

    autoLogin() {
        let data = localStorage.getItem('userData');
        if (data) {
            const user = JSON.parse(data);
            if (user) {
                this.user.next(user);
                this.router.navigate(['/event'])
            }
        } else {
            this.router.navigate(['/home']);
        }
    }

    logOut() {
        this.user.next(null);
        this.router.navigate(['auth']);
        localStorage.removeItem('userData');
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }


    private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const user = new User(email, localId, idToken, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occur';

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXIST':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email doesnot exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Oops!.. Wrong password';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Invalid login credentials'
                break;
            case 'ADMIN_ONLY_OPERATION':
                errorMessage = 'Please use provided creds'
                break;
            case 'EMAIL_EXISTS':
                errorMessage = 'Email already exists'
                break;
        }

        return throwError(errorMessage);
    }
}