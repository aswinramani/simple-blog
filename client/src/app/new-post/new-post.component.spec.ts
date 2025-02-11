import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NewPostComponent } from './new-post.component';
import { PostService } from '../services/post.service';
import { MockPostService } from '../services/mock-post.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostBody } from '../interfaces/PostBody';


describe('NewPostComponent', () => {
  let component: NewPostComponent;
  let fixture: ComponentFixture<NewPostComponent>;
  let postService: PostService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPostComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: PostService, useClass: MockPostService },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.postForm?.valid).toBeFalsy();
  });

  it('should have a valid form when filled correctly', () => {
    component.postForm?.controls['title'].setValue('Valid Title');
    component.postForm?.controls['content'].setValue('This is some valid content with enough length.');
    expect(component.postForm?.valid).toBeTruthy();
  });

  it('should call postService.createPost and navigate on successful form submission', async () => {
    spyOn(postService, 'createPost').and.callThrough();
    component.postForm?.controls['title'].setValue('Valid Title');
    component.postForm?.controls['content'].setValue('This is some valid content with enough length.');
    await component.submit();
    expect(postService.createPost).toHaveBeenCalledWith(component.postForm?.value as PostBody);
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
