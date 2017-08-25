import * as fragmentUtil from '../fragments'

describe('fragments', () => {
  describe('codeUpdated', () => {
    it('returns 1 fragment initially', () => {
      const result = fragmentUtil.codeUpdated([], 'hello')
      allEquals([{
        text: 'hello',
        parts: ['hello'],
        startPos: 0,
        endPos: 5,
        color: null,
        innerFragments: null
      }], result)
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

    it('adds fragments after', () => {
      const src = 'if stuff then 1 else 2'
      let result = fragmentUtil.codeUpdated([], src)
      result = fragmentUtil.highlight(result, src, 3, 8, '1')
      result = fragmentUtil.highlight(result, src, 14, 15, '2')
      allEquals([{
        text: src,
        parts: ['if ', ' then ', ' else 2'],
        startPos: 0,
        endPos: 22,
        color: null,
        innerFragments: [{
          text: 'stuff',
          parts: ['stuff'],
          startPos: 3,
          endPos: 8,
          color: '1',
          innerFragments: null
        }, {
          text: '1',
          parts: ['1'],
          startPos: 14,
          endPos: 15,
          color: '2',
          innerFragments: null
        }]
      }], result)
    })

    it('wraps an inner fragment when range is greater in both directions', () => {
      let result = fragmentUtil.highlight([], 'hello cruel world', 6, 11, '1')
      result = fragmentUtil.highlight(result, 'hello cruel world', 0, 17, '2')
      allEquals([{
        text: 'hello cruel world',
        parts: ['hello ', ' world'],
        startPos: 0,
        endPos: 17,
        color: '2',
        innerFragments: [{
          text: 'cruel',
          parts: ['cruel'],
          startPos: 6,
          endPos: 11,
          color: '1',
          innerFragments: null
        }]
      }], result)
    })

    it('does nothing when adding an out-of bounds highlight', () => {
      const result1 = fragmentUtil.highlight([], 'hello cruel world', 6, 11, '1')
      const result2 = fragmentUtil.highlight(result1, 'hello cruel world', 0, 8, '2')
      expect(result1).toBe(result2)

      const result3 = fragmentUtil.highlight([], 'hello cruel world', 6, 11, '1')
      const result4 = fragmentUtil.highlight(result3, 'hello cruel world', 7, 13, '2')
      expect(result3).toBe(result4)
    })

    it('does nothing when adding the same fragment again', () => {
      const src = 'hello cruel world'
      const result1 = fragmentUtil.highlight(fragmentUtil.codeUpdated([], src), src, 6, 11, '1')
      const result2 = fragmentUtil.highlight(result1, src, 6, 11, '2')
      expect(result1).toBe(result2)
    })

    it('adds color to an uncolored fragment', () => {
      const src = 'hello cruel world'
      const result1 = fragmentUtil.highlight(fragmentUtil.codeUpdated([], src), src, 0, 17, null)
      const result2 = fragmentUtil.highlight(result1, src, 0, 17, '1')
      expect(result1).not.toBe(result2)
      expect(result2.length).toBe(1)
      expect(result2[0].color).toBe('1')
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
