import * as fragmentUtil from '../fragments'

describe('fragments', () => {
  describe('codeUpdated', () => {
    it('returns0 fragments when there are none', () => {
      const result = fragmentUtil.codeUpdated([], 'hello')
      expect(result.length).toBe(0)
    })
  })

  describe('highlight', () => {
    it('adds fragments to the root', () => {
      const result = fragmentUtil.highlight([], 'hello cruel world', 6, 11, '1')
      allEquals([{
        text: 'cruel',
        parts: ['cruel'],
        startPos: 6,
        endPos: 11,
        color: '1',
        innerFragments: null
      }], result)
    })

    it('adds fragments to the root when there is one', () => {
      let result = fragmentUtil.highlight([], 'hello cruel world', 6, 11, '1')
      result = fragmentUtil.highlight(result, 'hello cruel world', 0, 5, '2')
      allEquals([{
        text: 'hello',
        parts: ['hello'],
        startPos: 0,
        endPos: 5,
        color: '2',
        innerFragments: null
      }, {
        text: 'cruel',
        parts: ['cruel'],
        startPos: 6,
        endPos: 11,
        color: '1',
        innerFragments: null
      }], result)
    })

    it('adds fragments to an inner fragment', () => {
      let result = fragmentUtil.highlight([], 'hello cruel world', 6, 17, '1')
      result = fragmentUtil.highlight(result, 'hello cruel world', 6, 11, '2')
      allEquals([{
        text: 'cruel world',
        parts: ['', ' world'],
        startPos: 6,
        endPos: 17,
        color: '1',
        innerFragments: [{
          text: 'cruel',
          parts: ['cruel'],
          startPos: 6,
          endPos: 11,
          color: '2',
          innerFragments: null
        }]
      }], result)
    })
  })

  describe('removeHighlight', () => {
    it('removes the fragment', () => {
      const src = 'hello cruel world'
      let result = fragmentUtil.highlight([], src, 6, 17, '1')
      result = fragmentUtil.highlight(result, src, 6, 11, '2')
      result = fragmentUtil.remove(result, src, result[0].innerFragments[0].key)

      allEquals([{
        text: 'cruel world',
        parts: ['cruel world'],
        startPos: 6,
        endPos: 17,
        color: '1',
        innerFragments: []
      }], result)
    })
  })
})

function allEquals (expected, actual) {
  if (expected === actual) {
    return
  }
  expect(actual.length).toBe(expected.length)
  for (let i in expected) {
    const e = expected[i]
    const a = actual[i]
    equals(e, a)
  }
}

function equals (expected, actual) {
  const { key: _, innerFragments: innerEx, ...restExpected } = expected
  const { key: __, innerFragments: innerAct, ...restActual } = actual
  expect(restActual).toEqual(restExpected)
  allEquals(innerEx, innerAct)
}
