import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { AutenticationAction, AutenticationState, AutneticationModel } from 'src/app/store/authorization';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @Select(AutenticationState.isUserLoggedIn) isUserLoggedIn$:
| Observable<AutneticationModel[]>
| undefined;
private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public translate : TranslateService,
    public fb : FormBuilder,
    public store : Store,
    private router : Router
  ) { }
   
  loginForm:FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.isUserLoggedIn$?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    .subscribe((data: any) => {
        localStorage.setItem("isUserAuthenticated", data);
        if(data) {         
          this.router.navigate(['/dashboard']); 
        }
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.required],
    })
  }

  onSubmit(data:any) {
    this.store.dispatch(new AutenticationAction.Login(data));
  }
}
