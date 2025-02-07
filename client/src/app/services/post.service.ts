import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3100';
  private postDetailData: any;

  constructor(
    private http: HttpClient,
    private readonly router: Router
  ) {}

  async getPosts(offset: number, limit: number) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/posts?offset=${offset}&limit=${limit}`));
  }

  async getCount() {
    return firstValueFrom(this.http.get(`${this.apiUrl}/posts/count`));
  }

  async getPostById(postId: string) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/posts/${postId}`));
  }

  async createPost(postData: any) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/posts`, postData));
  }

  setPostDetailData(post: any) {
    this.postDetailData = post;
  }

  getPostDetailData() {
    return this.postDetailData;
  }

  private isUUID(str: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  inPostDetailPage() {
    const routerUrl = this.router.url;
    const isPostState = routerUrl.includes('post');
    const stateList = routerUrl.split('/');
    return isPostState && this.isUUID(stateList[stateList.length-1]);
  }
}
