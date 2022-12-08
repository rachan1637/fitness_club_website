// import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import classnames from 'classnames';
// import Collapse from '@material-ui/core/Collapse';
// import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { fade } from '@material-ui/core/styles/colorManipulator';

// const CONTROL_TO_TOGGLE_ALIGNMENT_MAP = {
//   left: 'left',
//   right: 'right',
//   center: 'left',
//   justify: 'left',
// };

// const styles = theme => ({
//   root: {
//     cursor: 'pointer',
//   },
//   controlBar: {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },
//   controlBarJustify: {
//     justifyContent: 'space-between',
//   },
//   controlBarRight: {
//     justifyContent: 'flex-end',
//   },
//   controlBarCenter: {
//     justifyContent: 'center',
//   },
//   expand: {
//     transform: 'rotate(0deg)',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
//   },
//   expandOpen: {
//     transform: 'rotate(180deg)',
//   },
//   container: {
//     padding: 12,
//   },
// });

// export class SimpleCollapsible extends React.Component {
//   static defaultProps = {
//     togglePosition: 'auto',
//     controlBarAlign: 'left',
//     controlBarDense: false,
//     initialCollapsed: true,
//   };

//   state = { collapsed: this.props.initialCollapsed };

//   toggleCollapsed = () => {
//     this.setState(state => ({ collapsed: !state.collapsed }));
//   };

//   render() {
//     const {
//       classes,
//       togglePosition,
//       header,
//       renderControlBar,
//       controlBarAlign,
//     } = this.props;
//     const { collapsed } = this.state;

//     const alignmentClass = {
//       right: classes.controlBarRight,
//       center: classes.controlBarCenter,
//       justify: classes.controlBarJustify,
//     }[controlBarAlign];
//     const finalTogglePosition =
//       togglePosition !== 'auto'
//         ? togglePosition
//         : CONTROL_TO_TOGGLE_ALIGNMENT_MAP[controlBarAlign];

//     return (
//       <div className={classes.root}>
//         {renderControlBar ? (
//           renderControlBar({
//             classes,
//             header,
//             collapsed,
//             toggleCollapsed: this.toggleCollapsed,
//           })
//         ) : (
//           <Button
//             onClick={this.toggleCollapsed}
//             className={classnames(classes.controlBar, alignmentClass)}
//             aria-expanded={!collapsed}
//             aria-label="Show more"
//           >
//             {finalTogglePosition === 'right' && header}
//             <ExpandMoreIcon
//               className={classnames(classes.expand, {
//                 [classes.expandOpen]: !this.state.collapsed,
//               })}
//             />
//             {finalTogglePosition === 'left' && header}
//           </Button>
//         )}
//         <Collapse
//           in={!collapsed}
//           timeout="auto"
//           classes={{
//             wrapper: classes.container,
//           }}
//         >
//           {this.props.children}
//         </Collapse>
//       </div>
//     );
//   }
// }
