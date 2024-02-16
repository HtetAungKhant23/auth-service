type responseInterface = {
  statusCode: number;
  message: string;
  data: any;
};

export const Responser = ({ statusCode, message, data }: responseInterface) => {
  return {
    _meta: {
      success: statusCode >= 200 && statusCode <= 300 ? true : false,
      message: message,
    },
    _data: data,
  };
};
