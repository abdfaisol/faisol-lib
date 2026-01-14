export const convertForm = ({
  data,
  task,
}: {
  data: any[];
  task: (item: any, form: any) => void;
}) => {
  const form = new FormData();
  if (Array.isArray(data) && data?.length) {
    data.map((item: any) => {
      task(item, form);
    });
  }
  return form;
};
