// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Neocode } from '../client';

export abstract class APIResource {
  protected _client: Neocode;

  constructor(client: Neocode) {
    this._client = client;
  }
}
