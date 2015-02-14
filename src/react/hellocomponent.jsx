var Hello = React.createClass( {displayName: "Hello",
  propTypes: {
    fname: React.PropTypes.string.isRequired,
    lname: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.createElement("span", null, "Hello ", this.props.fname, " ", this.props.lname);
  }
} );
