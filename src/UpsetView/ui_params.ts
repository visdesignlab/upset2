let params = {
  header_body_padding: 5,
  used_sets: 0,
  column_width: 20,
  row_height: 20,

  used_set_header_height: 75,
  used_set_connector_height: 100,
  used_set_connector_skew: 45,
  get used_set_group_height() {
    return params.used_set_header_height + params.used_set_connector_height;
  },
  get skew_offset() {
    return (
      params.used_set_connector_height /
      Math.tan(deg2rad(params.used_set_connector_skew))
    );
  },

  row_group_height: 20,
  combinations_width: 0,
  get subset_row_width() {
    return (
      params.combinations_width +
      params.cardinality_width +
      params.deviation_width +
      params.column_width * 5
    );
  },
  get group_row_width() {
    return params.skew_offset + params.subset_row_width;
  },

  combo_circle_radius: 9,

  cardinality_width: 200,
  get cardinality_bar_height() {
    return params.row_height - 4;
  },
  cardinality_scale_group_height: 90,
  axis_offset: 30,
  cardinality_label_height: 24,
  cardinality_slider_dims: 10,
  horizon_offset: 6,

  deviation_width: 200,
  get deviation_bar_height() {
    return params.row_height - 4;
  },
  deviation_scale_group_height: 60,
  deviation_label_height: 24,

  get header_height() {
    return params.used_set_group_height;
  },

  get svg_height() {
    return (
      params.used_set_group_height +
      params.row_group_height +
      params.header_body_padding +
      5
    );
  },
  get svg_width() {
    return `${100}%`;
  }
};

export default params;

export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}
