import * as React from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import styled from 'styled-components';

interface Props {
  page: number;
  amount: number;
  options: number[];
  total: number;
  change: (page: number, amount: number) => void;
}

interface State {
  page: number;
  amount: number;
  minimum: number;
  maximum: number;
}

const PaginationDiv = styled.div`
  white-space: nowrap;
`;

class Pagination extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const amount = props.options[0];

    this.state = {
        page: 1,
        amount,
        minimum: 1,
        maximum: Math.ceil(props.total / amount),
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      maximum: Math.ceil(nextProps.total / nextProps.amount),
      page: nextProps.page,
      amount: nextProps.amount,
    });
  }

  renderOptions() {
    const options = this.props.options.map((item) => {
      return (
        <MenuItem
          value={item}
          key={`pagination-option-${item}`}
          primaryText={`${item} results per page`}
        />
      );
    });

    return (
      <DropDownMenu style={{top: '20px'}} onChange={this.setAmount} value={this.state.amount} >
        {options}
      </DropDownMenu>
    );
  }

  onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement);

    if (event.key === 'Enter') {
      this.setPage(parseInt(input.value, 10) >> 0);
    }
  }

  setPage(page: number) {
    page = page || 1;

    if (page >= this.state.minimum && page <= this.state.maximum && page !== this.state.page) {
      this.setState({page}, this.notify);
    }
  }

  setAmount = (event: React.KeyboardEvent<HTMLInputElement>, key: number) => {
    const option = (event.target as HTMLSelectElement);
    const amount = parseInt(option.value, 10) >> 0 || this.props.options[key];

    this.setState({
      amount,
      page: 1,
      maximum: Math.ceil(this.props.total / amount),
    }, this.notify);
  }

  notify() {
    this.props.change(this.state.page, this.state.amount);
  }

  render() {
    let offset = 0;

    if (this.state.page > 1) {
        offset = (this.state.page - 1) * (this.state.amount);
    }

    const resultText = `Showing ${offset + 1} to ${this.state.page * this.state.amount} of ${this.props.total} results`;

    return (
      <PaginationDiv>
        <FlatButton
          label={this.state.minimum}
          primary={true}
          onClick={this.setPage.bind(this, this.state.minimum)}
        />
        <TextField
          name={'Page Number'}
          hintText={this.state.page.toString()}
          onKeyPress={this.onEnter}
        />
        <FlatButton
          label={this.state.maximum}
          primary={true}
          onClick={this.setPage.bind(this, this.state.maximum)}
        />
        <FlatButton
          label='&lt;'
          primary={true}
          onClick={this.setPage.bind(this, this.state.page - 1)}
        />
        <FlatButton
          label='&gt;'
          primary={true}
          onClick={this.setPage.bind(this, this.state.page + 1)}
        />
        {this.renderOptions()}
        <span>{resultText}</span>
      </PaginationDiv>
    );
  }
}

export default Pagination;
