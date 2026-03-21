import { borrowing } from "./borrowing.js";
import { del } from "./del.js";
import { hasAsset } from "./hasAsset.js";
import { insert } from "./insert.js";
import { update } from "./update.js";

export const assetModel = { insert, update, del, hasAsset, borrowing };
