import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import icBack from './ic_back.svg';
import icForward from './ic_forward.svg';

import es from './locales/es';
import en from './locales/en';

const TODAY = new Date();

class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: new Date(),
      selected: new Date(),
      ldom: 30
    };
  }

  componentWillMount() {
    this.updateMonth(0);
  }

  updateMonth(months) {
    let current = this.state.current;
    current.setMonth(date.getMonth() + months);
    let ldom = new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
    this.setState({
      current: current,
      ldom: ldom
    });
  }

  prev = () => {
    this.updateMonth(-1);
  }

  next = () => {
    this.updateMonth(1);
  }

  _onDatePicked(month, day) {
    let date = new Date(this.state.current.getTime());
    date.setMonth(date.getMonth() + month);
    date.setDate(day);
    this.props.onDatePicked(date);
    this.setState({
      selected: date
    });
  }

  renderDay(opts={}) {
    let baseClasses = 'day noselect';
    let today = '';
    let todayStyle = {};
    let containerStyle = {};
    if (opts.today) {
      today = 'current';
      todayStyle = {
        borderColor: this.props.accentColor,
      };
    }

    let selected = '';
    let selectedStyle = {};
    if (opts.selected) {
      selected = 'selected';
      selectedStyle = {
        backgroundColor: this.props.accentColor
      }
      containerStyle = {
        color: '#ffffff'
      }
    }

    baseClasses += opts.current ? '' : ' non-current';

    return (
      <div
        className={baseClasses}
        style={containerStyle}
      >
        <div
          className={today}
          style={todayStyle}
        />
        <div
          className={selected}
          style={selectedStyle}
        />
        <p
          onClick={(ev) => {
            let day = ev.target.innerHTML;
            this._onDatePicked(opts.month, day);
          }}
        >
          {opts.date.getDate()}
        </p>
      </div>
    );
  }

  renderDays(copy) {
    let days = [];

    // set to beginning of month
    copy.setDate(1);

    // if we are missing no offset, include the previous week
    let offset = copy.getDay() === 0 ? 7 : copy.getDay();

    copy.setDate(-offset);

    let inMonth = false;
    let lastMonth = true;
    for (let i = 0; i < 42; i++) {
      // increase date
      copy.setDate(copy.getDate() + 1);

      // make sure we pass any previous month values
      if (i < 30 && copy.getDate() === 1) {
        inMonth = true;
        lastMonth = false;
      } else if (i > 30 && copy.getDate() === 1) {
        inMonth = false;
      }

      let sel = new Date(this.state.selected.getTime());
      let isSelected = (sel.getFullYear() === copy.getFullYear() &&
          sel.getDate() === copy.getDate() &&
          sel.getMonth() === copy.getMonth());

      let isToday = (TODAY.getFullYear() === copy.getFullYear() &&
          TODAY.getDate() === copy.getDate() &&
          TODAY.getMonth() === copy.getMonth());

      days.push(this.renderDay({
        today: isToday,
        selected: isSelected,
        current: inMonth,
        month: (inMonth ? 0 : (lastMonth ? -1 : 1)),
        date: copy
      }));
    }

    return days;
  }

  renderHeaders() {
    let header = [];

    for (let index = 0; index < config.weekSubs.length; index++) {
      header.push(
        <p className="day-headers noselect">
          {config.weekSubs[index]}
        </p>
      );
    }

    return header;
  }

  render() {
    // get su-sat header
    let header = this.renderHeaders();

    // copy our current time state
    let copy = new Date(this.state.current.getTime());

    // get the month days
    let days = this.renderDays(copy);

    let headerMonth = [this.props.locale].months[this.state.selected.getMonth()];
    let headerDate = this.state.selected.getDate();
    let month = [this.props.locale].months[this.state.current.getMonth()];
    let year = this.state.current.getFullYear();
    let date = this.state.current.getDate();

    let upperDate = null;
    if (this.props.showHeader) {
      upperDate = (
        <div
          className="flex-2 header center"
          style={{
            backgroundColor: this.props.accentColor
          }}
        >
          <p className="header-month">
            {headerMonth.toUpperCase()}
          </p>
          <p className="header-day">
            {headerDate}
          </p>
        </div>
      );
    }

    return (
      <div className={this.props.orientation}>
        {upperDate}
        <div className="padding">
          <div className="month">
            <img
              className="month-arrow-left"
              src={icBack}
              alt="back"
              onClick={this.prev}
            />
            <p className="month-title">
              {month}
              <br/>
              <span className="month-year">
                {year}
              </span>
            </p>
            <img
              className="month-arrow-right"
              src={icForward}
              alt="forward"
              onClick={this.next}
            />
          </div>
          <div className="footer">
            {header}
            {days}
          </div>
        </div>
      </div>
    );
  }
};

Calendar.propTypes = {
  accentColor: PropTypes.string,
  onDatePicked: PropTypes.func,
  showHeader: PropTypes.bool,
  orientation: PropTypes.string,
};

Calendar.defaultProps = {
  accentColor: '#00C1A6',
  onDatePicked: () => {},
  showHeader: true,
  orientation: 'flex-col'
};

export default Calendar;
