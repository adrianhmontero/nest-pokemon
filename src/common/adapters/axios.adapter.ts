import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

/* Al añadir implements HttpAdapter estamos indicando que esta clase debe tener la misma
    estructura que la clase abstracta/interface HttpAdapter. En este caso, nuestra clase debe contener 
    un método llamado get, que reciba el parámetro url de tipo string y que devuelva una promesa de
    tipo T (Definida donde se use el método). */
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;
  /* Las < y > representan un genérico, mientras que la T representa el tipo de dato que va a ser
        definido donde se use el método get. */
  async get<T>(url: string): Promise<T> {
    try {
      // petición Get
      /* En esta parte, definimos que axios.get va a retornar una respuesta de tipo T.
            Es decir, el tipo que se defina donde este scope (método get de nuestra clase) se ejecute. */
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error('AxiosAdapter.get has failed.');
    }
  }
  async post(url: string, data: any) {
    // petición Get
    return;
  }
  async patch(url: string, data: any) {
    // petición Get
    return;
  }
  async delete(url: string) {
    // petición Get
    return;
  }
}
