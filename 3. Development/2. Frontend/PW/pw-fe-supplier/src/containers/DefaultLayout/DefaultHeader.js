import React, {Component} from 'react';
import cls from "./header.module.less";
import RightContent from "../../components/GlobalHeader/RightContent";
import {Layout} from "antd";
import {connect} from "react-redux";
import { AuthActions, NewsActions} from "../../redux/actions";

const {Header} = Layout;

class DefaultHeader extends Component {

    componentDidMount() {
        this.props.fetchUserInfo();
        this.props.fetchTopNews();
    }

    render() {

        return (
            <Header className={cls.header}>
                <RightContent
                    history={this.props.history}
                    signOut={this.props.signOut}
                    userInfo={this.props.userInfo}
                    listTopNews={this.props.listTopNews}
                />
            </Header>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.toJS().auth.userInfo.data,
    listTopNews: state.toJS().news.listTopNews,
});

const mapDispatchToProps = (dispatch) => ({
    fetchUserInfo: () => dispatch(AuthActions.fetchUserInfo()),
    fetchTopNews: () => dispatch(NewsActions.fetchTopNews()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DefaultHeader);
