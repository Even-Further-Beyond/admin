import { connect } from 'react-redux';

import { actions } from '../reducers/auth';
// import RequireAuth from './RequireAuth';
import User from '../components/UserControlPanel';
import RootState from '../types/RootState';

const mapStateToProps = (state: RootState) => {
    return {
        isAuthenticated: actions.isAuthenticated(state.auth),
        profile: state.auth.profile,
        isSuperUser: actions.isSuperUser(state),
    };
};

export default connect(mapStateToProps, null)(User);
