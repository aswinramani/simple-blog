import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MockPostService } from '../shared/mock-post.service';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postService: PostService;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      params: of({ postId: '123' })
    };

    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      providers: [
        { provide: PostService, useClass: MockPostService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post detail if post is already available', () => {
    spyOn(postService, 'getPostDetailData').and.returnValue({ id: '123', title: 'Test Post', content: 'Test Content' });

    component.ngOnInit();

    expect(component.post).toEqual({ id: '123', title: 'Test Post', content: 'Test Content' });
    expect(component.onGoingRequest).toBe(false);
  });

  it('should load post detail by id if post is not already available', fakeAsync(() => {
    spyOn(postService, 'getPostDetailData').and.returnValue(undefined);
    spyOn(postService, 'getPostById').and.returnValue(Promise.resolve({ data: { id: '123', title: 'Test Post', content: 'Test Content' } }));

    component.ngOnInit();
    tick();

    expect(component.post).toEqual({ id: '123', title: 'Test Post', content: 'Test Content' });
    expect(component.onGoingRequest).toBe(false);
  }));

  it('should navigate to /posts if post not found', fakeAsync(() => {
    spyOn(postService, 'getPostDetailData').and.returnValue(undefined);
    spyOn(postService, 'getPostById').and.returnValue(Promise.resolve({ data: null }));
    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  }));
});