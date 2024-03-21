import { BaseComponent } from "../BaseComponent";
import { HTMLElement } from "./HtmlElement";
import { HtmlElementCollection } from "./HtmlElementCollection";
import { Pagination } from "./Pagination";

export class Table extends BaseComponent {
  get paginations() {
    return HtmlElementCollection.by('.ant-table-pagination');
  }
  get topPagination() {
    return new Pagination(this.paginations.get(0));
  }
  get bottomPagination() {
    return new Pagination(this.paginations.get(1));
  }

  get headerColumns() {
    return HtmlElementCollection.by('.ant-table-thead .ant-table-cell');
  }
  get checkAllCheckbox() {
    return HTMLElement.by('.ant-table-selection');
  }

  get tableRows() {
    return HtmlElementCollection.by('.ant-table-row');
  }

  async clickHeaderColumn(name: string) {
    await this.headerColumns.findElementByText(name).click();
  }

  async selectAll() {
    await this.checkAllCheckbox.click();
  }

  async selectByRowIndex(index) {
    await this.tableRows.get(index).findElement('.ant-table-selection-column .ant-checkbox').click();
  }

  async getCell(columnName: string, rowIndex: number) {
    const index = await this.headerColumns.getIndexByText(columnName);
    const cell = await this.tableRows.get(rowIndex).findElements('.ant-table-cell').get(index);

    return cell;
  }

  async getCellValue(columnName: string, rowIndex: number) {
    const cell = await this.getCell(columnName, rowIndex);

    return cell.getText();
  }
}
