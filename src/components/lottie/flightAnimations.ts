/**
 * Pure vector Bodymovin / Lottie JSON animation definitions for flights and radar
 * Formatted to standard Lottie format (v5.5.2) compatible with lottie-react
 */

export const airplaneFlightLottie = {
  v: "5.5.2",
  fr: 60,
  ip: 0,
  op: 180,
  w: 500,
  h: 240,
  nm: "AviancaFlightAnimation",
  ddd: 0,
  assets: [],
  layers: [
    // Airplane Body
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Airplane",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-3], e: [4] },
            { t: 90, s: [4], e: [-3] },
            { t: 180, s: [-3] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [180, 130, 0], e: [320, 95, 0] },
            { t: 90, s: [320, 95, 0], e: [180, 130, 0] },
            { t: 180, s: [180, 130, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        // Fuselage
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [110, 26] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 13 },
              nm: "Fuselage"
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              nm: "WhiteFill"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.88, 0.12, 0.15, 1] }, // Avianca Red border
              w: { a: 0, k: 3 },
              nm: "RedStroke"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        },
        // Red Tail Fin (Avianca Signature)
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [24, 34] },
              p: { a: 0, k: [-48, -16] },
              r: { a: 0, k: 4 },
              nm: "TailFin"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.88, 0.12, 0.15, 1] }, // Avianca Red
              o: { a: 0, k: 100 },
              nm: "TailRedFill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        },
        // Main Wing
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [46, 12] },
              p: { a: 0, k: [-4, 14] },
              r: { a: 0, k: 5 },
              nm: "Wing"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.93, 0.15, 0.18, 1] },
              o: { a: 0, k: 100 },
              nm: "WingFill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        },
        // Cockpit Window
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [14, 10] },
              p: { a: 0, k: [46, -4] },
              nm: "Cockpit"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.2, 0.25, 0.35, 1] },
              o: { a: 0, k: 100 },
              nm: "WindowFill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    },
    // Contrail Jet Stream
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Contrail",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [60], e: [90] },
            { t: 90, s: [90], e: [60] },
            { t: 180, s: [60] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 130, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [160, 4] },
              p: { a: 0, k: [-70, 0] },
              r: { a: 0, k: 2 },
              nm: "Line"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.88, 0.12, 0.15, 0.4] }, // translucent red vapor
              o: { a: 0, k: 60 },
              nm: "Fill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    },
    // Floating Cloud 1
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Cloud1",
      sr: 1,
      ks: {
        o: { a: 0, k: 70 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [480, 70, 0], e: [20, 70, 0] },
            { t: 180, s: [20, 70, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [46, 24] },
              p: { a: 0, k: [0, 0] },
              nm: "Puff"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.94, 0.95, 0.98, 1] },
              o: { a: 0, k: 100 },
              nm: "CloudFill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    },
    // Floating Cloud 2
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Cloud2",
      sr: 1,
      ks: {
        o: { a: 0, k: 50 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [380, 170, 0], e: [-40, 170, 0] },
            { t: 180, s: [-40, 170, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [120, 120, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [56, 26] },
              p: { a: 0, k: [0, 0] },
              nm: "Puff2"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.94, 0.95, 0.98, 1] },
              o: { a: 0, k: 100 },
              nm: "CloudFill2"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

export const radarScanLottie = {
  v: "5.5.2",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "RadarPing",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "RadarSweep",
      sr: 1,
      ks: {
        o: { a: 0, k: 90 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [80, 3] },
              p: { a: 0, k: [40, 0] },
              nm: "Beam"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.88, 0.12, 0.15, 1] }, // Avianca Red
              o: { a: 0, k: 90 },
              nm: "BeamFill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "PulseRing",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], e: [0] },
            { t: 120, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [20, 20, 100], e: [95, 95, 100] },
            { t: 120, s: [95, 95, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [160, 160] },
              p: { a: 0, k: [0, 0] },
              nm: "Circle"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.88, 0.12, 0.15, 1] },
              w: { a: 0, k: 2.5 },
              nm: "RingStroke"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};
