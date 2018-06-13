let params = {
  padding: 2,

  col_width: 30,

  used_set_header_height: 70,
  connector_height: 80,
  get header_height() {
    return (
      this.used_set_header_height + this.connector_height + this.padding * 2
    );
  },

  row_height: 30
};

export default params;
