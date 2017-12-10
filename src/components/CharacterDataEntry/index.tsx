import * as React from 'react';
import { ChildProps } from 'react-apollo';
import Pagination from '../Pagination';
import CircularProgress from 'material-ui/CircularProgress';

import { Response, InputProps } from '../../types/response/CharacterDataEntry';
import Characters from '../../containers/Characters';

interface State {
  page: number;
  amount: number;
  total: number;
}

class CharacterDataEntry extends React.Component<ChildProps<InputProps, Response>, State> {
  private paginationOptions = [5, 10, 25, 50];

  constructor(props: ChildProps<InputProps, Response>) {
    super(props);

    this.state = {
      page: 1,
      amount: 5,
      total: null,
    };
  }

  componentWillReceiveProps(nextProps: ChildProps<InputProps, Response>) {
    if (nextProps.data.totalCharactersCount) {
        this.setState({total: nextProps.data.totalCharactersCount});
    }
  }

  change = (page: number, amount: number) => {
    this.setState({
        page,
        amount,
    });
  }

  render() {
    const { loading, error, characterTraits, tags } = this.props.data;

    if (loading) {
      return <CircularProgress size={160} thickness={5} />;
    }

    if (error) {
      return <span>Error loading character attributes and tags.</span>;
    }

    let offset = 0;

    if (this.state.page > 1) {
      offset = (this.state.page - 1) * (this.state.amount);
    }

    return (
      <div>
        <Pagination
          total={this.state.total}
          page={this.state.page}
          amount={this.state.amount}
          change={this.change}
          options={this.paginationOptions}
        />
        <br />
        <Characters
          limit={this.state.amount}
          offset={offset}
          characterTraits={characterTraits}
          tags={tags}
          isSuperUser={this.props.isSuperUser}
        />
        <br />
        <Pagination
          total={this.state.total}
          page={this.state.page}
          amount={this.state.amount}
          change={this.change}
          options={this.paginationOptions}
        />
      </div>
    );
  }
}

export default CharacterDataEntry;
