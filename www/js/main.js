import { basicData } from "../../shared/validators/index.js";
import { testX } from "../validators/x/test.js";

const basic = basicData.safeParse({ username: "22" });
const test = testX.safeParse({ name: "XXXXX" });
console.log(test);
console.log(basic);
