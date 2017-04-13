import getOptimalTimeInterval from 'utils/get-optimal-time-interval'

describe('getOptimalTimeInterval', () => {
  it('should return a sorted (increasing) list of 4 month indicies', () => {
    const testInput = [
      {
        chanceOf: {
          chanceofprecip: {
            percentage: '80',
          },
        },
        tempLow: {
          avg: {
            c: '2',
          },
        },
        tempHigh: {
          avg: {
            c: '8',
          },
        },
      },
      {
        chanceOf: {
          chanceofprecip: {
            percentage: '40',
          },
        },
        tempLow: {
          avg: {
            c: '5',
          },
        },
        tempHigh: {
          avg: {
            c: '8',
          },
        },
      },
      {
        chanceOf: {
          chanceofprecip: {
            percentage: '45',
          },
        },
        tempLow: {
          avg: {
            c: '1',
          },
        },
        tempHigh: {
          avg: {
            c: '19',
          },
        },
      },
      {
        chanceOf: {
          chanceofprecip: {
            percentage: '52',
          },
        },
        tempLow: {
          avg: {
            c: '1',
          },
        },
        tempHigh: {
          avg: {
            c: '0',
          },
        },
      },
    ]
    const expectedOutput = [2, 1, 0, 3]
    expect(getOptimalTimeInterval(testInput)).toEqual(expectedOutput)
  })
})
