import * as renderSelectedMonth from 'view/controls'
import store from 'store'

jest.mock('view/controls', () => () => {})
jest.mock('view/markers')
jest.mock('view/map')

describe('store', () => {
  describe('when initialized', () => {
    it('should contain an empty places list', () => {
      expect(store.places).toEqual([])
    })
  })
})
