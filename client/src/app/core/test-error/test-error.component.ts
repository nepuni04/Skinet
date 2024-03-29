import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  baseUrl = environment.apiUrl;
  validationErrors: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(): void {
    this.http.get(`${this.baseUrl}/buggy/notfound`).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  get500Error(): void {
    this.http.get(`${this.baseUrl}/buggy/servererror`).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  get400Error(): void {
    this.http.get(`${this.baseUrl}/buggy/badrequest`).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  get400ValidationError(): void {
    this.http.get(`${this.baseUrl}/buggy/badrequest/twenty`).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
      this.validationErrors = error.errors;
    });
  }
}
