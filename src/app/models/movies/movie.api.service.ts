import {Injectable} from '@angular/core';
import {Endpoint} from '../../services/interfaces/interfaces';
import {ApiService} from '../../services/model/_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../services/http/http.service';
import {CONFIG} from '../../shared/config';

@Injectable()
export class MovieApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'companies:list'
   */
  endpoints: Endpoint = {
    list: {uri: '?$select=title,release_year,production_company,actor_1,actor_2,actor_3,director,distributor,writer&$group=title,release_year,production_company,actor_1,actor_2,actor_3,director,distributor,writer&$order=title', verb: 'get'},
    view: {uri: '?title=', verb: 'get'},
    query: {uri: '/?plot=fill&r=json', verb: 'get'},
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'movies:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'movies';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'CandidateModel',
   * consumes this observer for listening to API changes.
   */
  observer$: Observable<Array<any>> = new Observable(observer =>
    this._observer = observer).share();

  /**
   * The Company API service constructor function, invoked by base classes.
   */
  constructor(protected _http: HttpService) {
    super(_http);
  }

  query(params:any = {}):void {
    console.log('params: ', params);
    let y = (params.y) ? '&y='+params.y : '';
    let t = (params.t) ? '&t='+encodeURI(params.t) : '';
    this._httpService.get(this.endpoints.query.uri+t+y, {}, CONFIG.URI.OMDB)
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }
}
