import React, { useEffect, useState } from "react";
import { EVENT_FORMATS, EVENT_STATUSES } from "../constants/eventOptions";
import authService from "../services/index.services";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ImageUpload from "./ImageUpload";

function AddEventForm() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [ isLoading, setIsLoading ] = useState(true)
 
  const [event, setEvent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleImageUpload = (cloudinaryImageUrl) => {
    setEvent((prevEvent) => ({
        ...prevEvent,
        imageUrl: cloudinaryImageUrl
    }))
  }

  const getEventDate = () => {
    const dateTime = new Date(`${event.date}T${event.time}`);
    return dateTime.toISOString();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: event.title,
      description: event.description,
      format: event.format,
      location: event.location,
      date: getEventDate(),
      imageUrl: event.imageUrl,
      ticketUrl: event.ticketUrl,
      status: event.status,
    }

    let response
    if(eventId) {
        response = await authService.patch(`events/${eventId}`, body);
    } else {
        response = await authService.post("/events", body);
    }
    console.log(response);
    navigate(`/events/${response.data._id}`);
  };

  const fetchExistingEvent = async () => {
    try {
      const response = await authService.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getDateAndTimeValues = (dateValue) => {
  const date = new Date(dateValue)

  const pad = (value) => String(value).padStart(2, "0")

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
}

  const loadForm = async () => {
    if (eventId) {
      const existingEvent = await fetchExistingEvent();
      const { date, time } = getDateAndTimeValues(existingEvent.date)
     setEvent({
      ...existingEvent,
      date,
      time
    })
      setIsLoading(false)
    } else {
      setEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        format: "",
        imageUrl: "",
        ticketUrl: "",
        status: "",
      });
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadForm()
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        {eventId ? (
          <h1 className="page-header-hero"> Edit Event Details </h1>
        ) : (
          <h1 className="page-header-hero"> Create an event </h1>
        )}
      </div>
      {isLoading ? <p> Form is loading </p>
      : <div className="form-container" >
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="title"> Event Title * </label>
            <input
              id="title"
              name="title"
              value={event.title}
              maxLength={100}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description"> Description </label>
            <textarea
              id="description"
              name="description"
              value={event.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date"> Date * </label>
            <input
              id="date"
              type="date"
              name="date"
              value={event.date}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time"> Time * </label>
            <input
              id="time"
              type="time"
              name="time"
              value={event.time}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="location"> Location * </label>
            <input
              id="location"
              name="location"
              value={event.location}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="format"> Format * </label>
            <select
              id="format"
              name="format"
              value={event.format}
              required
              onChange={handleInputChange}
            >
              {EVENT_FORMATS.map((format, index) => {
                return (
                  <option key={index} value={format.value}>
                    {" "}
                    {format.label}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl"> Image URL </label>
            {/* <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={event.imageUrl}
              onChange={handleInputChange}
            /> */}
            <ImageUpload handleImageUpload={handleImageUpload}/>
          </div>
          <div>
            <label htmlFor="ticketUrl"> Ticket URL </label>
            <input
              id="ticketUrl"
              type="url"
              name="ticketUrl"
              value={event.ticketUrl}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="status"> Status </label>
            <select
              id="status"
              name="status"
              value={event.status}
              onChange={handleInputChange}
            >
              {EVENT_STATUSES.map((status, index) => {
                return (
                  <option key={index} value={status.value}>
                    {" "}
                    {status.label}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          <button className="btn-secondary" type="submit">
           {eventId ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>}
    </div>
  );
}

export default AddEventForm;
