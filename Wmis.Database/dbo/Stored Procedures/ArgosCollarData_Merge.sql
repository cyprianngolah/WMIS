CREATE PROCEDURE [dbo].[ArgosCollarData_Merge]
	@p_argosData [ArgosCollarDataTableType] READONLY,
	@p_collaredAnimalId INT
AS

	MERGE ArgosCollarData AS T
	USING @p_argosData AS S
	ON (T.CollaredAnimalId = @p_collaredAnimalId AND T.[Date] = S.[Date] AND T.ValueType = S.ValueType) 
	WHEN MATCHED 
		THEN UPDATE SET Value = S.Value
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(CollaredAnimalId, [Date], ValueType, Value) VALUES (@p_collaredAnimalId, S.[Date], S.ValueType, S.Value);

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosCollarData_Merge] TO [WMISUser]
GO