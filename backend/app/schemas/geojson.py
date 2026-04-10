from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Tuple, Any

class PointGeometry(BaseModel):
    type: str = Field(default="Point", pattern="^Point$")
    coordinates: Tuple[float, float]

    @model_validator(mode='before')
    @classmethod
    def translate_wkb_to_dict(cls, data: Any):
        # Check if the data is a spatial binary element from the database
        if data.__class__.__name__ == 'WKBElement':
            from geoalchemy2.shape import to_shape
            
            # to_shape safely converts the DB binary into a Shapely object
            point = to_shape(data)
            
            # Return the exact dictionary format Pydantic expects
            return {
                "type": "Point",
                "coordinates": [point.x, point.y]
            }
        return data

    @field_validator('coordinates')
    def validate_coordinates(cls, v):
        lng, lat = v
        if not (-180 <= lng <= 180):
            raise ValueError('Longitude must be between -180 and 180')
        if not (-90 <= lat <= 90):
            raise ValueError('Latitude must be between -90 and 90')
        return v