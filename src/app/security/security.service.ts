import { Injectable } from '@angular/core';
import { AppUserAuth } from './app-user-auth';
import { Observable, of } from 'rxjs';
import { AppUser } from './app-user';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators/';


const API_URL = "http://localhost:5000/api/security/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient) { }

  resetSecurityObject():void{
    this.securityObject.userName = "";
    this.securityObject.bearerToken = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.claims =[];

    localStorage.removeItem("bearerToken");
  }


  login(entity:AppUser): Observable<AppUserAuth>{
      this.resetSecurityObject();

      return this.http.post<AppUserAuth>(API_URL + "login", entity, httpOptions)
      .pipe(tap(resp=>{
          Object.assign(this.securityObject, resp);
          localStorage.setItem("bearerToken", this.securityObject.bearerToken);
      }));

      /*
      Object.assign(this.securityObject, LOGIN_MOCKS.find(user=>user.userName.toLocaleLowerCase() === entity.userName.toLocaleLowerCase()));
      if(this.securityObject.userName!=""){
        localStorage.setItem("bearerToken", this.securityObject.bearerToken);
      }*/

     // return of<AppUserAuth>(this.securityObject);

  }

  logout():void{
    this.resetSecurityObject();
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  hasClaim(claimType: any, claimValue?: any) {
    let ret: boolean = false;

    // See if an array of values was passed in.
    if (typeof claimType === "string") {
      ret = this.isClaimValid(claimType, claimValue);
    }
    else {
      let claims: string[] = claimType;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }


  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret: boolean = false;
    let auth: AppUserAuth = null;

    // Retrieve security object
    auth = this.securityObject;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(":") >= 0) {
        let words: string[] = claimType.split(":");
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      }
      else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : "true";
      }
      // Attempt to find the claim
      ret = auth.claims.find(c =>
        c.claimType.toLowerCase() == claimType &&
        c.claimValue == claimValue) != null;
    }

    return ret;
  }

  
}
