let params = {
  column_width: 20,

  used_set_header_height: 75,
  used_set_connector_height: 100,
  used_set_connector_skew: 45,
  get used_set_group_height() {
    return params.used_set_header_height + params.used_set_connector_height;
  }
};

export default params;
