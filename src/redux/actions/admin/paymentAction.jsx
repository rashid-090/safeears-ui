import { createAsyncThunk } from "@reduxjs/toolkit";
import { commonReduxRequest } from "../../../Common/api";
import { appJson } from "../../../Common/configurations";

export const getPayments = createAsyncThunk(
  "payments/getPayments",
  async (queries, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/admin/payments${queries && `?${queries}`}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);
