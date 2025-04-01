import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  async getCurrentUser(): Promise<User> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`)
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener el usuario');
    }

    return response.data;
  }
} 