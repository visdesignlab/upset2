let params = {
  padding: 2,

  textHeight: 19.33,

  col_width: 30,

  used_set_header_height: 70,
  connector_height: 120,
  get header_height() {
    return (
      this.used_set_header_height + this.connector_height + this.padding * 2
    );
  },

  row_height: 30,

  max_cardinality_width: 200,
  cardinality_height: 25,

  cardinality_scale_height: 100,
  get cardinality_scale_width(): number {
    return this.max_cardinality_width;
  },

  get deviation_bar_height(): number {
    return this.cardinality_height;
  },

  dev_scale_height: 60,
  deviation_width: 200
};

export default params;
