import React, { Fragment } from "react";
import { Modal, Button } from "semantic-ui-react";
import CourtCard from "./CourtCard";
import CourtDetailShow from "./CourtDetailShow";
const CourtList = props => {
  return props.courts.map(court => (
    <div className="lit" style={{ zIndex: 100000 }}>
      <Modal
        key={court.id}
        trigger={
          <Button className="ui button">
            <CourtCard key={court.id} court={court} />{" "}
          </Button>
        }
        // header={court.name}
        // content={court.address}
        // actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
      >
        <CourtDetailShow
          court={court}
          getDailyPeakTimes={props.getDailyPeakTimes}
          getWeeklyPeakTimes={props.getWeeklyPeakTimes}
          getAllVisits={props.getAllVisits}
        ></CourtDetailShow>
      </Modal>
    </div>
  ));
};

export default CourtList;
