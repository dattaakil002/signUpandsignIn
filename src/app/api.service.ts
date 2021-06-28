import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    SignUrl = 'https://jsonplaceholder.typicode.com/comments';
    httpheaders = new HttpHeaders().set('Content-Type', 'application/Json');
    options = {
         headers: this.httpheaders
    };

    constructor(private httpClient: HttpClient) { }

   postSignInDetails(body: any): Observable<any>{
       return this.httpClient.post(this.SignUrl, body, this.options);
   }

   postSignUpDetails(body: any): Observable<any>{
       return this.httpClient.post(this.SignUrl, body, this.options);
   }

}