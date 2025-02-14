import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MockPostService } from '../services/mock-post.service';


describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postService: PostService;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PostsComponent],
      imports: [MatPaginatorModule],
      providers: [
        { provide: PostService, useClass: MockPostService },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', fakeAsync(() => {
    spyOn(postService, 'getPosts').and.callThrough();
    spyOn(postService, 'getCount').and.callThrough();

    component.ngOnInit();
    tick();

    expect(postService.getPosts).toHaveBeenCalledWith(0, 10);
    expect(postService.getCount).toHaveBeenCalled();
    expect(component.posts.length).toBe(10);
    expect(component.totalPosts).toBe(12);
    expect(component.onGoingRequest).toBe(false);
  }));

  it('should create a new post', () => {
    component.create();
    expect(router.navigate).toHaveBeenCalledWith(['/post/new']);
  });

  it('should load more posts on pagination', fakeAsync(() => {
    spyOn(postService, 'getPosts').and.callThrough();
    spyOn(postService, 'getCount').and.callThrough();
    component.ngOnInit();
    tick();

    const pageEvent = { pageIndex: 1, pageSize: 5, length: 2 } as any;
    component.loadMore(pageEvent);
    tick();
    expect(postService.getPosts).toHaveBeenCalledWith(0, 10);
    expect(postService.getCount).toHaveBeenCalled();
  }));

  it('should navigate to post detail', () => {
    const mockPost = { id: '1', title: 'Post 1', content: 'Content 1' };
    spyOn(postService, 'setPostDetailData');

    component.navigateToDetail(mockPost);

    expect(postService.setPostDetailData).toHaveBeenCalledWith(mockPost);
    expect(router.navigate).toHaveBeenCalledWith(['/post', mockPost.id]);
  });

  it('should return paginated posts', () => {
    component.posts = [
      { id: '1', title: 'Post 1', content: 'Content 1' },
      { id: '2', title: 'Post 2', content: 'Content 2' },
      { id: '3', title: 'Post 3', content: 'Content 3' },
      { id: '4', title: 'Post 4', content: 'Content 4' }
    ];
    component.itemsPerPage = 2;
    component.paginator.pageIndex = 1;

    const paginatedPosts = component.paginatedPosts;

    expect(paginatedPosts.length).toBe(2);
    expect(paginatedPosts[0].id).toBe('3');
    expect(paginatedPosts[1].id).toBe('4');
  });
});
