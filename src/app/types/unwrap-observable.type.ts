import { Observable } from 'rxjs';

export type UnwrapObservable<T> = T extends Observable<infer U> ? U : never;
