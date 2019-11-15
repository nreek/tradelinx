import React, { Component, Fragment } from 'react';

import ErrorBoundary from './ErrorBoundary';

class WidgetWrapper extends Component {
	state = {
	  activeWidget: {
	    index: 0,
	    className: this.props.classNames[0],
	  },
	  hidden: false,
	  sumOfTabWidths: null,
	  overflowTabs: false,
	  responsiveTabsMenuHidden: true,
	};

	componentDidMount() {
	  const sumOfTabWidths = this.calculateTabWidths();
	  this.setState({ sumOfTabWidths }, this.checkIfTabsOverflow);
	  window.addEventListener('resize', this.checkIfTabsOverflow);
	}

	componentWillUnmount() {
	  window.removeEventListener('resize', this.checkIfTabsOverflow);
	}

	componentDidUpdate(prevProps) {
	  if (prevProps.tabs.length !== this.props.tabs.length) {
	    const sumOfTabWidths = this.calculateTabWidths();
	    this.setState({
	      sumOfTabWidths,
	      activeWidget: {
	        index: 0,
	        className: this.props.classNames[0],
	      },
	    }, this.checkIfTabsOverflow);
	  }
	}

	// Event Handlers
	handleHideToggle = () => this.setState({
	    hidden: !this.state.hidden,
	    responsiveTabsMenuHidden: true,
	  });

	handleWidgetSelection = index => this.setState({
	    hidden: false,
	    activeWidget: {
	      index,
	      className: this.props.classNames[index],
	    },
	    responsiveTabsMenuHidden: true,
	  });

	handleResponsiveTabsMenuToggle = () => this.setState({
	    responsiveTabsMenuHidden: !this.state.responsiveTabsMenuHidden,
	  });

	handleClickOutside = () => this.setState({ responsiveTabsMenuHidden: true });

	handleWidgetClick = () => this.setState({ responsiveTabsMenuHidden: true });

	handleHeaderClick = () => {
	  !this.state.responsiveTabsMenuHidden && this.setState({ responsiveTabsMenuHidden: true });
	  this.state.hidden && this.setState({ hidden: false });
	}

	// Class Methods
	checkIfTabsOverflow = () => {
	  const { sumOfTabWidths, overflowTabs } = this.state;
	  const { className } = this.state.activeWidget;
		const viewportWidth = window.innerWidth;
		if(viewportWidth <= 687){
			const headerWidth = document.querySelector(`.${className}-container .component-header`).clientWidth;
			if (sumOfTabWidths > headerWidth - 45 && overflowTabs !== true) {
				this.setState({ overflowTabs: true });
			} else if (sumOfTabWidths <= headerWidth - 45 && overflowTabs !== false) {
				this.setState({ overflowTabs: false });
			}
		}
	}

	calculateTabWidths = () => {
	  const { className } = this.state.activeWidget;
	  const tabs = [...document.querySelectorAll(`.${className}-container .component-tab`)];
	  const sumOfTabWidths = tabs
	    .map(tab => tab.clientWidth)
	    .reduce((sum, tabWidth) => sum += tabWidth, 0);

	  return sumOfTabWidths;
	}

	// Renderer Methods
	renderTabs = () => (
	  this.props.tabs.map((tab, index, array) => {
	    const clickHandler = array.length > 1 ? () => this.handleWidgetSelection(index) : null;
	    let className = 'component-tab';
	    if (array.length > 1) { className += ' link'; }
	    if (this.state.activeWidget.index === index) { className += ' active'; }
	    return (
  <li
    key={index}
    onClick={clickHandler}
    className={className}
  >
		{tab === "Charts" ? null : tab}
  </li>
	    );
	  })
	)

  renderTabsOverflow = () => (
    <Fragment>
      <li className="component-tab">
        {this.props.tabs[this.state.activeWidget.index]}
      </li>
      <li className="component-tab responsive-menu-tabs-icon-container">
        <div className="responsive-menu-tabs-icon" onClick={this.handleResponsiveTabsMenuToggle}>
          {this.state.responsiveTabsMenuHidden
            ? <i className="fas fa-ellipsis-h" />
            : <i className="fas fa-times-circle" />
          }
        </div>
      </li>
    </Fragment>
  )

	renderResponsiveTabsMenu = () => (
  <div className="responsive-tabs-menu-container">
    <div className="arrow-up" />
    <ul className="responsive-tabs-menu">{this.renderTabs()}</ul>
  </div>
	)

	render() {
	  const activeIndex = this.state.activeWidget.index;
	  const activeClass = this.props.classNames[activeIndex];
	  return (
  <div className={`component-container ${activeClass}-container`}>

    {/* Overlay on page to click out of the responsive menu */}
    {!this.state.responsiveTabsMenuHidden ? (
      <div
        className="page-overlay"
        onClick={() => this.setState({ responsiveTabsMenuHidden: 'true' })}
        style={{
						  height: '100vh',
						  width: '100vw',
						  position: 'fixed',
						  top: '0',
						  left: '0',
        }}
      />
    ) : null}

    <div
      className="component-header"
      onClick={this.handleHeaderClick}
    >
      {/* COMPONENT COLLAPSE BUTTON, re-add once we determine how to make the grid more responsive to collapsable components */}
      {/* <div className='ui-elements' onClick={this.handleHideToggle}>
						{this.state.hidden ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>}
					</div>  */}
      <ul className="component-tabs">
        {this.state.overflowTabs ? this.renderTabsOverflow() : this.renderTabs()}
      </ul>
      {/* {this.state.overflowTabs ? (
        <div className="responsive-menu-tabs-icon" onClick={this.handleResponsiveTabsMenuToggle}>
          {this.state.responsiveTabsMenuHidden ? <i className="fas fa-ellipsis-h" /> : <i className="fas fa-times-circle" />}
        </div>
      ) : null} */}
      {this.state.responsiveTabsMenuHidden ? null : this.renderResponsiveTabsMenu()}
    </div>
    <div className="component-contents" onClick={this.handleWidgetClick}>
      <ErrorBoundary>
        {this.state.hidden ? null : this.props.children[activeIndex] || this.props.children}
      </ErrorBoundary>
    </div>
  </div>
	  );
	}
}

export default WidgetWrapper;
