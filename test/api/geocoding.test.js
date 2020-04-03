const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const { expect } = chai;

import * as Http from '../../src/http';
import STATUS from '../../src/status_codes';

import Geocoding from '../../src/api/geocoding';

describe('Geocoding', () => {
  const latitude = 40.7041895;
  const longitude = -73.9867797;

  const mockQuery = '20 Jay Street';

  afterEach(() => {
    Http.request.restore();
  });

  context('geocode', () => {
    it('should throw a server error if invalid JSON is returned in the response', () => {
      const jsonErrorResponse = '"invalid_json": true}';
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onSuccess(jsonErrorResponse);
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.geocode({ query: mockQuery }, geocodeCallback);

      expect(geocodeCallback).to.be.calledWith(STATUS.ERROR_SERVER);
    });

    it('should return the error from the http request', () => {
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onError('http error');
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.geocode({ query: mockQuery }, geocodeCallback);

      expect(geocodeCallback).to.be.calledWith('http error');
    });

    it('should succeed', () => {
      const jsonSuccessResponse = '{"addresses":["matching-addresses"]}';
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onSuccess(jsonSuccessResponse);
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.geocode({ query: mockQuery }, geocodeCallback);

      const [method, path, body] = httpRequestSpy.getCall(0).args;
      expect(method).to.equal('GET');
      expect(path).to.equal('v1/geocode/forward');
      expect(body).to.deep.equal({
        query: mockQuery,
      });

      expect(geocodeCallback).to.be.calledWith(STATUS.SUCCESS, ['matching-addresses']);
    });
  });

  context('reverseGeocodeLocation', () => {
    it('should throw a server error if invalid JSON is returned in the response', () => {
      const jsonErrorResponse = '"invalid_json": true}';
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onSuccess(jsonErrorResponse);
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.reverseGeocodeLocation({ latitude, longitude }, geocodeCallback);

      expect(geocodeCallback).to.be.calledWith(STATUS.ERROR_SERVER);
    });

    it('should return the error from the http request', () => {
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onError('http error');
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.reverseGeocodeLocation({ latitude, longitude }, geocodeCallback);

      expect(geocodeCallback).to.be.calledWith('http error');
    });

    it('should succeed', () => {
      const jsonSuccessResponse = '{"addresses":["matching-addresses"]}';
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onSuccess(jsonSuccessResponse);
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.reverseGeocodeLocation({ latitude, longitude }, geocodeCallback);

      const [method, path, body] = httpRequestSpy.getCall(0).args;
      expect(method).to.equal('GET');
      expect(path).to.equal('v1/geocode/reverse');
      expect(body).to.deep.equal({
        coordinates: `${latitude},${longitude}`,
      });

      expect(geocodeCallback).to.be.calledWith(STATUS.SUCCESS, ['matching-addresses']);
    });
  });

  context('ipGeocode', () => {
    it('should throw a server error if invalid JSON is returned in the response', () => {
      const jsonErrorResponse = '"invalid_json": true}';
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onSuccess(jsonErrorResponse);
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.ipGeocode(geocodeCallback);

      expect(geocodeCallback).to.be.calledWith(STATUS.ERROR_SERVER);
    });

    it('should return the error from the http request', () => {
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onError('http error');
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.ipGeocode(geocodeCallback);

      expect(geocodeCallback).to.be.calledWith('http error');
    });

    it('should succeed', () =>{
      const jsonSuccessResponse = '{"country":"matching-country"}';
      const httpRequestSpy = sinon.spy((method, path, body, onSuccess, onError) => {
        onSuccess(jsonSuccessResponse);
      });
      sinon.stub(Http, 'request').callsFake(httpRequestSpy);

      const geocodeCallback = sinon.spy();
      Geocoding.ipGeocode(geocodeCallback);

      const [method, path] = httpRequestSpy.getCall(0).args;
      expect(method).to.equal('GET');
      expect(path).to.equal('v1/geocode/ip');

      expect(geocodeCallback).to.be.calledWith(STATUS.SUCCESS, 'matching-country');
    });
  });
});
