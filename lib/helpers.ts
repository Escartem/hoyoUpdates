export function round(val: any, precision: number) {
    return Math.round((val + Number.EPSILON) * (10**precision)) / (10**precision)
}

export function convertSize(size: string | number | undefined, precision: number=2) {
    if (!size) {
        return '0 B';
    }

    var isize = typeof(size) === "number" ? size : parseInt(size);

    if (isize < 1024) {
        return `${isize} B`
    } else if (isize / 1024 < 1024) {
        return `${round(isize / 1024, precision)} KB`
    } else if (isize / 1024 / 1024 < 1024) {
        return `${round(isize / 1024 / 1024, precision)} MB`
    } else if (isize / 1024 / 1024 / 1024 < 1024) {
        return `${round(isize / 1024 / 1024 / 1024, precision)} GB`
    } else {
        return `${round(isize / 1024 / 1024 / 1024 / 1024, precision)} TB`
    }
}