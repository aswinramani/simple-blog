import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3100';

  constructor(private http: HttpClient) {}

  async getPosts(offset: number, limit: number) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/posts?offset=${offset}&limit=${limit}`));
  }

  getPostById(postId: string) {
    return this.http.get<any>(`${this.apiUrl}/posts/${postId}`);
  }

  async createPost(postData: any) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/posts`, postData));
  }
}
