export type ArrayElement<T extends Array<any>> = T extends (infer U)[] ? U : never;
