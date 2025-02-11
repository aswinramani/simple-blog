import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Post } from '../interfaces/Post';
import { PostCount } from '../interfaces/PostCount';
import { PostBody } from '../interfaces/PostBody';
import { PostResponse } from '../interfaces/PostResponse';

@Injectable({
  providedIn: 'root'
})
export class MockPostService {
  private postDetailData: Post | undefined;

  getPosts(offset: number, limit: number) {
    const mockPosts: Post[] = [
      { id: '1', title: 'Test Post 1', content: 'Test Content 1' },
      { id: '2', title: 'Test Post 2', content: 'Test Content 2' }
    ];
    return of(mockPosts);
  }

  getCount() {
    const mockPostCount: PostCount = { totalCount: 2 };
    return of(mockPostCount);
  }

  getPostById(postId: string) {
    const mockPostResponse: PostResponse = { data: { id: postId, title: `Test Post ${postId}`, content: `Test Content ${postId}` } };
    return of(mockPostResponse);
  }

  createPost(postData: PostBody) {
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
