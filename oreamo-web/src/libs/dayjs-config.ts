import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import "dayjs/locale/ko";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
