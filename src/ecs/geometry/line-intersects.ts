// Shamelessly taken from tmpvar/segseg
// https://github.com/tmpvar/segseg

export type Point = [number, number]

export enum Result {
    DONT_INTERSECT,
    DO_INTERSECT,
    COLINEAR,
}

function distance(v: Readonly<Point>, w: Readonly<Point>): number {
    return (v[0] - w[0]) * (v[0] - w[0]) + (v[1] - w[1]) * (v[1] - w[1])
}

function distanceToSegmentSquared(
    p: Readonly<Point>,
    v: Readonly<Point>,
    w: Readonly<Point>,
): number {
    const l2 = distance(v, w)

    if (l2 === 0) {
        return distance(p, v)
    }

    const t = Math.max(
        0,
        Math.min(1, ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2),
    )
    return distance(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])])
}

function isOnSegment(
    p: Readonly<Point>,
    t0: Readonly<Point>,
    t1: Readonly<Point>,
    epsilon: number,
): boolean {
    return !(Math.sqrt(distanceToSegmentSquared(p, t0, t1)) > epsilon)
}

function segseg(
    out: Point,
    p1: Readonly<Point>,
    p2: Readonly<Point>,
    p3: Readonly<Point>,
    p4: Readonly<Point>,
): Result {
    const x1 = p1[0]
    const y1 = p1[1]
    const x2 = p2[0]
    const y2 = p2[1]
    const x3 = p3[0]
    const y3 = p3[1]
    const x4 = p4[0]
    const y4 = p4[1]

    // Compute a1, b1, c1, where line joining points 1 and 2
    // is "a1 x  +  b1 y  +  c1  =  0".
    const a1 = y2 - y1
    const b1 = x1 - x2
    const c1 = x2 * y1 - x1 * y2

    // Compute r3 and r4.
    const r3 = a1 * x3 + b1 * y3 + c1
    const r4 = a1 * x4 + b1 * y4 + c1

    // Check signs of r3 and r4.  If both point 3 and point 4 lie on
    // same side of line 1, the line segments do not intersect.
    if (r3 !== 0 && r4 !== 0 && ((r3 >= 0 && r4 >= 0) || (r3 < 0 && r4 < 0))) {
        return Result.DONT_INTERSECT
    }

    // Compute a2, b2, c2
    const a2 = y4 - y3
    const b2 = x3 - x4
    const c2 = x4 * y3 - x3 * y4

    // Compute r1 and r2
    const r1 = a2 * x1 + b2 * y1 + c2
    const r2 = a2 * x2 + b2 * y2 + c2

    // Check signs of r1 and r2.  If both point 1 and point 2 lie
    // on same side of second line segment, the line segments do
    // not intersect.
    if (r1 !== 0 && r2 !== 0 && ((r1 >= 0 && r2 >= 0) || (r1 < 0 && r2 < 0))) {
        return Result.DONT_INTERSECT
    }

    // Line segments intersect: compute intersection point.
    const denominator = a1 * b2 - a2 * b1

    if (denominator === 0) {
        return Result.COLINEAR
    }

    const x = b1 * c2 - b2 * c1
    const y = a2 * c1 - a1 * c2

    out[0] = (x < 0 ? x : x) / denominator
    out[1] = (y < 0 ? y : y) / denominator

    return Result.DO_INTERSECT
}

export function intersects(
    line1: [Readonly<Point>, Readonly<Point>],
    line2: [Readonly<Point>, Readonly<Point>],
    epsilon: number = 0,
): boolean {
    const [p1, p2] = line1
    const [p3, p4] = line2
    const out: Point = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    const result = segseg(out, p1, p2, p3, p4)

    if (result === Result.DO_INTERSECT) {
        return true
    }

    // handle collinear cases and when a line segment endpoint lies on the other segment
    if (isOnSegment(p1, p3, p4, epsilon)) {
        out[0] = p1[0]
        out[1] = p1[1]
        return true
    }

    if (isOnSegment(p2, p3, p4, epsilon)) {
        out[0] = p2[0]
        out[1] = p2[1]
        return true
    }

    if (isOnSegment(p3, p1, p2, epsilon)) {
        out[0] = p3[0]
        out[1] = p3[1]
        return true
    }

    if (isOnSegment(p4, p1, p2, epsilon)) {
        out[0] = p4[0]
        out[1] = p4[1]
        return true
    }

    return false
}
