import { chain } from "iterable-chain";
import { ChainIterable } from "iterable-chain/lib/chainIterable";

export function zip<T1, T2>(a: Iterable<T1>, b: Iterable<T2>): ChainIterable<[T1, T2]> {
    return chain(zipGenerator(a, b));
}

function* zipGenerator<T1, T2>(a: Iterable<T1>, b: Iterable<T2>) {
    const aIter = a[Symbol.iterator]();
    const bIter = b[Symbol.iterator]();

    let aNext = aIter.next();
    let bNext = bIter.next();

    while (!aNext.done && !bNext.done) {
        yield [aNext.value, bNext.value] as [T1, T2];
        aNext = aIter.next();
        bNext = bIter.next();
    }
}
