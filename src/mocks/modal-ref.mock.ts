import { ConfirmType, ModalOptions, NzModalRef } from "ng-zorro-antd/modal";

export const modalRefConfirmMock = (({ nzOnOk }: { nzOnOk: () => void }) => ({
  triggerOk: () => nzOnOk(),
})) as (
  options?: ModalOptions<unknown, any, any> | undefined,
  confirmType?: ConfirmType | undefined,
) => NzModalRef<unknown, any>
