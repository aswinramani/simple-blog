import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../interfaces/Post';
import { PostCount } from '../interfaces/PostCount';
import { PostBody } from '../interfaces/PostBody';
import { PostResponse } from '../interfaces/PostResponse';

@Injectable({
  providedIn: 'root'
})
export class MockPostService {
  private postDetailData: Post | undefined;

  getPosts(offset: number, limit: number): Promise<Post[]> {
    const mockPosts: Post[] = [
      { id: '1', title: 'Test Post 1', content: 'Test Content 1' },
      { id: '2', title: 'Test Post 2', content: 'Test Content 2' },
      { id: '3', title: 'Post 3', content: 'Content 3' },
      { id: '4', title: 'Post 4', content: 'Content 4' },
      { id: '5', title: 'Post 5', content: 'Content 5' },
      { id: '6', title: 'Post 6', content: 'Content 6' },
      { id: '7', title: 'Post 7', content: 'Content 7' },
      { id: '8', title: 'Post 8', content: 'Content 8' },
      { id: '9', title: 'Post 9', content: 'Content 9' },
      { id: '10', title: 'Post 10', content: 'Content 10' },
      { id: '11', title: 'Post 11', content: 'Content 11' },
      { id: '12', title: 'Post 12', content: 'Content 12' }
    ].slice(offset, offset + limit);
    return Promise.resolve(mockPosts)
  }

  getCount(): Promise<PostCount> {
    const mockPostCount: PostCount = { totalCount: 12 };
    return Promise.resolve(mockPostCount);
  }

  getPostById(postId: string): Observable<PostResponse> {
    const mockPostResponse: PostResponse = { data: { id: postId, title: `Test Post ${postId}`, content: `Test Content ${postId}` } };
    return of(mockPostResponse);
  }

  createPost(postData: PostBody): Observable<Post> {
    return of(({ id: '3', title: postData.title, content: postData.content }) as Post);
  }

  setPostDetailData(post: Post): void {
    this.postDetailData = post;
  }

  getPostDetailData(): Post | undefined {
    return this.postDetailData;
  }

  inPostDetailPage(): boolean {
    return false;
  }
};
