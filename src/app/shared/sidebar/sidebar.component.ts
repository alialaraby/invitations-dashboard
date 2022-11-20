import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Admin } from 'src/app/core/model/admin';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public tripsCollapsed = false;
  public passengersCollapsed = false;
  public accountsCollapsed = false;
  public boatsCollapsed = false;
  public packagesCollapsed = false;
  public samplePagesCollapsed = false;
  
  sharedUserData: Admin = new Admin();
  @ViewChild('sidebar', { read: ElementRef, static:false }) sidebarRef: ElementRef;


  constructor(
    private sharedData: SharedDataService,
    private renderer: Renderer2
  ) { 
    this.sharedData.userData$.subscribe(
      (userData) => {
        this.sharedUserData._id = userData._id;
        this.sharedUserData.accessToken = userData.accessToken;
        this.sharedUserData.role = userData.role;
        this.sharedUserData.isSuperAdmin = userData.isSuperAdmin;
        this.sharedUserData.isAdmin = userData.isAdmin;
        this.sharedUserData.isCorporateAdmin = userData.isCorporateAdmin;
        this.sharedUserData.isAnalystAdmin = userData.isAnalystAdmin;
      }
    );

    this.renderer.listen('window', 'click', (e: Event) => {
      if(this.sidebarRef.nativeElement.classList.contains('active')){
        if (e.target && e.target['classList'] && !e.target['classList'].contains('mdi-menu') && e.target !== this.sidebarRef.nativeElement) {
          this.sidebarRef.nativeElement.classList.remove('active')
        }
      }
      
    });
  }

  ngOnInit() {
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

  closeItem(){
    this.sidebarRef.nativeElement.classList.remove('active')
  }
}
