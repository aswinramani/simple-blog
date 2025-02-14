import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Router } from '@angular/router';
import { Post } from '../interfaces/Post';
import { PostCount } from '../interfaces/PostCount';
import { PostBody } from '../interfaces/PostBody';
import { PostResponse } from '../interfaces/PostResponse';
import { env } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

class MockRouter {
  private _url = '';

  get url() {
    return this._url;
  }

  setUrl(url: string) {
    this._url = url;
  }
}

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let mockRouter: MockRouter;
  const host = env.host;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PostService,
        { provide: Router, useClass: MockRouter }
      ]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts', async () => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Post 1', content: 'Content 1' },
      { id: '2', title: 'Post 2', content: 'Content 2' }
    ];

    service.getPosts(0, 10).then(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${host}/posts?offset=0&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch post count', async () => {
    const mockCount: PostCount = { totalCount: 2 };

    service.getCount().then(count => {
      expect(count.totalCount).toBe(2);
    });

    const req = httpMock.expectOne(`${host}/posts/count`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCount);
  });

  it('should fetch post by ID', async () => {
    const mockPost: PostResponse = { data: { id: '1', title: 'Post 1', content: 'Content 1' } };

    service.getPostById('1').then(response => {
      expect(response.data).toEqual(mockPost.data);
    });

    const req = httpMock.expectOne(`${host}/posts/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should create a new post', async () => {
    const postData: PostBody = { title: 'New Post', content: 'New Content' };
    const mockPost: Post = { id: '1', title: 'New Post', content: 'New Content' };

    service.createPost(postData).then(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${host}/posts`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });

  it('should set and get post detail data', () => {
    const post: Post = { id: '1', title: 'Post 1', content: 'Content 1' };
    service.setPostDetailData(post);
    expect(service.getPostDetailData()).toEqual(post);
  });

  it('should detect if URL contains a valid UUID', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const invalidUUID = 'invalid-uuid';

    expect(service['isUUID'](validUUID)).toBeTrue();
    expect(service['isUUID'](invalidUUID)).toBeFalse();
  });

  it('should detect if in post detail page', () => {
    mockRouter.setUrl('/post/123e4567-e89b-12d3-a456-426614174000');
    expect(service.inPostDetailPage()).toBeTrue();

    mockRouter.setUrl('/post/invalid-uuid');
    expect(service.inPostDetailPage()).toBeFalse();

    mockRouter.setUrl('/other');
    expect(service.inPostDetailPage()).toBeFalse();
  });
});
